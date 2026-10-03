<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class StaticPageController extends Controller
{
    public function tokushoho()
    {
        return Inertia::render('Legal/Tokushoho');
    }

    public function privacy()
    {
        return Inertia::render('Legal/Privacy');
    }

    public function contact()
    {
        return Inertia::render('Contact');
    }
}
