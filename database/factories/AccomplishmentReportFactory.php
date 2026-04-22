<?php

namespace Database\Factories;

use App\Models\AccomplishmentReport;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AccomplishmentReport>
 */
class AccomplishmentReportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->unique()->dateTimeBetween('-100 days', '+10 days');
        $end = (clone $start)->modify("+5 days");
        return [
            //
            'report_code' => fake()->name(),
            'user_id' => 3,
            'start_date' => $start,
            'end_date' => $end,
            'status' => 'draft'
        ];
    }
}
