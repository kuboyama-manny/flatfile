<?php

namespace App\Http\Resources\API;

use Illuminate\Http\Resources\Json\Resource;

class BatchResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'end_user_id' => $this->end_user_id,
            'end_user' => $this->endUser,
            'filename' => $this->filename,
            'original_file' => $this->original_file,
            'manual' => $this->manual,
            'managed' => $this->managed,
            'memo' => $this->memo,
            'headers_raw' => $this->headers_raw,
            'headers_matched' => $this->headers_matched,
            'count_rows' => $this->count_rows,
            'count_columns' => $this->count_columns,
            'count_columns_matched' => $this->count_columns_matched,
            'count_rows_invalid' => $this->count_rows_invalid,
            'count_rows_accepted' => $this->count_rows_accepted,
            'failure_reason' => $this->failure_reason,
            'status' => $this->status,

            'submitted_at' => $this->submitted_at ? $this->submitted_at->toIso8601String() : null,
            'created_at' => $this->created_at->toIso8601String(),
            'matched_at' => $this->matched_at ? $this->matched_at->toIso8601String() : null,
            'failed_at' => $this->failed_at ? $this->failed_at->toIso8601String() : null,
            'handled_at' => $this->handled_at ? $this->handled_at->toIso8601String() : null,
            'uploads' => $this->uploads->map(function ($upload) {
                return [
                    'id' => $upload->id,
                    'url' => $upload->getTemporaryUrl(now()->addMinutes(20)),
                    'filename' => $upload->filename,
                    'filesize' => $upload->filesize,
                    'filetype' => $upload->filetype
                ];
            })
        ];
    }
}
