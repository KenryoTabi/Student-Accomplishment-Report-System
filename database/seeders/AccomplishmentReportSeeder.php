<?php

namespace Database\Seeders;

use App\Models\AccomplishmentReport;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AccomplishmentReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        AccomplishmentReport::factory()->count(20)->create();
    }
}
