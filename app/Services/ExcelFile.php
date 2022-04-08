<?php
namespace App\Services;

use PhpOffice\PhpSpreadsheet\IOFactory as SpreadsheetIO;
use League\Csv\Exception;
use League\Csv\Writer;
use SplFileObject;
use App\Exceptions\XLSParsingException;

class ExcelFile
{
    /**
     * The full path to the excel file being processed
     */
    private $realPath;

    public function __construct($realPath)
    {
        $this->realPath = $realPath;
    }


    /**
     * Return a CSV string
     */
    public function getCSVString()
    {
        $csv = Writer::createFromFileObject(new SplFileObject('php://temp', 'w'));
        $csv->insertAll($this->getContentsAsArray());
        return $csv->getContent();
    }

    /**
     * Parse the XLS file and return an array of arrays
     */
    private function getContentsAsArray()
    {
        try {
            $reader = $this->getXLSReader();
            $worksheet = $reader->getActiveSheet();
            $sheetCount = $reader->getSheetCount();
            if ($sheetCount>1) {
                throw new XLSParsingException("Worksheet contains more than one sheet", 500);
            }
            $sheetnames = $reader->getSheetNames();
            $this->checkActiveSheetImage($worksheet);
            $rows = [];
            foreach ($worksheet->getRowIterator() as $row) {
                $cellIterator = $row->getCellIterator();
                $cellIterator->setIterateOnlyExistingCells(false);
                $row = [];
                foreach ($cellIterator as $cell) {
                    $row[] = $cell->getFormattedValue();
                }
                $rows[] = $row;
            }
            return $rows;
        } catch (\ErrorException  $e) {
            throw new XLSParsingException('Active sheet may be empty or it may contains pictures.', 500);
        }
    }

    /**
     * Return an XLS reader for the current file
     */
    private function getXLSReader()
    {
        return SpreadsheetIO::load($this->realPath);
    }

    /**
     * Check if XLS active sheet has pictures
     */
    private function checkActiveSheetImage($worksheet)
    {
        if (!empty($worksheet->getDrawingCollection())) {
            foreach ($worksheet->getDrawingCollection() as $drawing) {
                if ($drawing instanceof \PhpOffice\PhpSpreadsheet\Worksheet\MemoryDrawing) {
                    throw new XLSParsingException("Active sheet may contains pictures.", 500);
                }
            }
        }
    }
}
