<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\ExcelFile;
use Illuminate\Support\Facades\Storage;

class ExcelController extends Controller
{
    public function excelReader(Request $request)
    {
        $fileName = $request->attachment
                        ? $request->attachment->getRealPath()
                        : base_path(). '/tests/Stubs/robots.xlsx';

        $reader = new ExcelFile($fileName);
        return response($reader->getCSVString(), 200)
                  ->header('Content-Type', 'text/csv');
    }
}
