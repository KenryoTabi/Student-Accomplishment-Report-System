<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sections', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code')->unique()->nullable();
            $table->string('description')->nullable();
            $table->timestamps();
        });

        DB::table('sections')->insert([
            [
                'name' => 'Regional Information and Communications Technology Management Section', 
                'code' => 'RICTMS', 
                'description' => 'Responsible for managing information and communications technology within the region', 
                'created_at' => now(), 
                'updated_at' => now()
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sections');
    }
};
