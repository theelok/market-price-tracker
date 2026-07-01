namespace MarketPriceTracker.Domain.Models;

/// <summary>
/// An ingredient whose purchase prices are tracked over time.
/// </summary>
public class Ingredient
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Category { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<Purchase> Purchases { get; set; } = [];
}
