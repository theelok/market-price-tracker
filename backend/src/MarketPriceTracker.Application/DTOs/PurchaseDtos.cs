using System.ComponentModel.DataAnnotations;

namespace MarketPriceTracker.Application.DTOs;

public class PurchaseDto
{
    public int Id { get; set; }
    public int IngredientId { get; set; }
    public string IngredientName { get; set; } = string.Empty;
    public string ShopName { get; set; } = string.Empty;
    public decimal Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public DateTime PurchaseDate { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public decimal UnitPrice => Quantity > 0 ? Math.Round(Price / Quantity, 2) : 0;
}

public class CreatePurchaseDto
{
    [Required(ErrorMessage = "IngredientId is required.")]
    public int IngredientId { get; set; }

    [Required(ErrorMessage = "Shop name is required.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Shop name must be between 1 and 200 characters.")]
    public string ShopName { get; set; } = string.Empty;

    [Range(0.001, double.MaxValue, ErrorMessage = "Quantity must be greater than zero.")]
    public decimal Quantity { get; set; }

    [Required(ErrorMessage = "Unit is required.")]
    [StringLength(20, MinimumLength = 1, ErrorMessage = "Unit must be between 1 and 20 characters.")]
    public string Unit { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Purchase date is required.")]
    public DateTime PurchaseDate { get; set; }

    [StringLength(500, ErrorMessage = "Notes cannot exceed 500 characters.")]
    public string? Notes { get; set; }
}

public class UpdatePurchaseDto
{
    [Required(ErrorMessage = "Shop name is required.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "Shop name must be between 1 and 200 characters.")]
    public string ShopName { get; set; } = string.Empty;

    [Range(0.001, double.MaxValue, ErrorMessage = "Quantity must be greater than zero.")]
    public decimal Quantity { get; set; }

    [Required(ErrorMessage = "Unit is required.")]
    [StringLength(20, MinimumLength = 1, ErrorMessage = "Unit must be between 1 and 20 characters.")]
    public string Unit { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
    public decimal Price { get; set; }

    [Required(ErrorMessage = "Purchase date is required.")]
    public DateTime PurchaseDate { get; set; }

    [StringLength(500, ErrorMessage = "Notes cannot exceed 500 characters.")]
    public string? Notes { get; set; }
}
