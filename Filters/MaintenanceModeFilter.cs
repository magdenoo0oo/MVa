using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace StudentManagement.Filters
{
    public class MaintenanceModeFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var configuration = context.HttpContext.RequestServices.GetService<IConfiguration>();
            var isMaintenanceMode = configuration?.GetValue<bool>("MaintenanceMode:IsEnabled") ?? false;

            // Skip maintenance mode for Account controller
            var controllerName = context.RouteData.Values["controller"]?.ToString();
            if (controllerName == "Account")
            {
                base.OnActionExecuting(context);
                return;
            }

            // Check if it's weekend (optional maintenance trigger)
            var isWeekend = DateTime.Now.DayOfWeek == DayOfWeek.Saturday || 
                           DateTime.Now.DayOfWeek == DayOfWeek.Sunday;

            if (isMaintenanceMode || isWeekend)
            {
                var message = configuration?.GetValue<string>("MaintenanceMode:Message") ?? 
                             "The system is under maintenance during weekends. Please try again on weekdays.";

                context.Result = new ViewResult
                {
                    ViewName = "Maintenance",
                    ViewData = new Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary(
                        new Microsoft.AspNetCore.Mvc.ModelBinding.EmptyModelMetadataProvider(),
                        new Microsoft.AspNetCore.Mvc.ModelBinding.ModelStateDictionary())
                    {
                        ["MaintenanceMessage"] = message
                    }
                };
            }

            base.OnActionExecuting(context);
        }
    }
}