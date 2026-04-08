<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InternsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('interns')->insert([
            'user_id' => 1,
            'school' => 'Iloilo Science And Technology University',
            'course' => 'Computer Science',
            'supervisor_id' => 2,
            'year_level' => '4th Year',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
