using MarketPriceTracker.Application.Interfaces;
using MarketPriceTracker.Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace MarketPriceTracker.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IIngredientService, IngredientService>();
        services.AddScoped<IPurchaseService, PurchaseService>();
        services.AddScoped<IStatisticsService, StatisticsService>();
        return services;
    }
}
