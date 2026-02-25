<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\DB;

class UniqueIgnoreCase implements Rule
{
    protected $table;
    protected $column;
    protected $ignoreId;
    protected $idColumn;

    /**
     * Create a new rule instance.
     *
     * @param string $table The table name.
     * @param string $column The column to check against.
     * @param mixed|null $ignoreId The ID to ignore (usually the current record ID on updates).
     * @param string $idColumn The name of the ID column to ignore (default is 'id').
     */
    public function __construct(string $table, string $column, $ignoreId = null, string $idColumn = 'id')
    {
        $this->table = $table;
        $this->column = $column;
        $this->ignoreId = $ignoreId;
        $this->idColumn = $idColumn;
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        // Convert the input value to lowercase for comparison
        $valueLower = strtolower($value);

        $query = DB::table($this->table)->whereRaw("LOWER({$this->column}) = ?", [$valueLower]);

        // If an ignore ID is provided, exclude it from the query
        if ($this->ignoreId) {
            $query->where($this->idColumn, '!=', $this->ignoreId);
        }

        // The rule passes if no matching record exists
        return !$query->exists();
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'El valor ya está registrado.';
    }
}
