using MarketPriceTracker.Application.Interfaces;
using MarketPriceTracker.Infrastructure.Data.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace MarketPriceTracker.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IIngredientRepository, IngredientRepository>();
        services.AddScoped<IPurchaseRepository, PurchaseRepository>();
        return services;
    }
}
