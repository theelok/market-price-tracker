using Microsoft.AspNetCore.Mvc;

namespace MarketPriceTracker.Api.Controllers;

/// <summary>
/// Lightweight health endpoint for uptime checks and local development verification.
/// </summary>
[ApiController]
[Route("[controller]")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "healthy",
            service = "Market Price Tracker API",
            timestamp = DateTime.UtcNow
        });
    }
}
