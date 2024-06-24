<?php

namespace App\Providers;

use Bezhanov\Faker\Provider\Commerce;
use Faker\Factory;
use Generator;
use Illuminate\Support\ServiceProvider;

class FakerAdditionProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $locale = app('config')->get('app.faker_locale') ?? 'en_US';

        $abstract = Generator::class . ':' . $locale;

        $this->app->singleton($abstract, function () use ($locale) {
            $faker = Factory::create($locale);

            $faker->addProvider(new Commerce($faker));

            return $faker;
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
