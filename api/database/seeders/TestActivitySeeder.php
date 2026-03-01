<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TestActivitySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        event(new \App\Events\SystemActivityEvent(
        'Se activó una nueva licencia Premium', 
        'system', 
        'verified_user',
        'superadmin-feed'
    ));
    }
}
