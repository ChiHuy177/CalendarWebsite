using CalendarWebsite.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace CalendarWebsite.Server.Controllers;

    [ApiController]
    [Route("api/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventService _eventService;

        public EventsController(IEventService eventService)
        {
            _eventService = eventService;
        }

        [HttpGet]
        public async Task<IActionResult> GetEvents([FromQuery] long userId, [FromQuery] DateTime start, [FromQuery] DateTime end)
        {
            var events = await _eventService.GetEventsAsync(userId, start, end);
            return Ok(events);
        }
    }
