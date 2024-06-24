<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->ulid("id")->primary();
            $table->string('name');
            $table->string('slug');
            $table->string('description');
            $table->foreignUlid('category_id')->constrained();
            $table->double('price');
            $table->double('width');
            $table->double('height');
            $table->double('weight');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
