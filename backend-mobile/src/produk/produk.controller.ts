// src/produk/produk.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe, // Otomatis ubah param 'id' string ke number
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProdukService } from './produk.service';
import { CreateProdukDto } from './dto/create-produk.dto';
import { UpdateProdukDto } from './dto/update-produk.dto';

@Controller('produk')
export class ProdukController {
  constructor(private readonly produkService: ProdukService) {}

  /**
   * POST /produk
   * (Create Produk)
   */
  @Post()
  create(@Body() createProdukDto: CreateProdukDto) {
    return this.produkService.create(createProdukDto);
  }

  /**
   * GET /produk
   * (List Produk)
   */
  @Get()
  findAll() {
    return this.produkService.findAll();
  }

  /**
   * GET /produk/{id}
   * (Show Produk)
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.produkService.findOne(id);
  }

  /**
   * POST /produk/{id}/update
   * (Update Produk)
   *
   * Catatan: Ini adalah rute kustom sesuai permintaan Anda.
   */
  @Post(':id/update')
  @HttpCode(HttpStatus.OK) // Ubah status default POST (201) menjadi 200
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProdukDto: UpdateProdukDto,
  ) {
    return this.produkService.update(id, updateProdukDto);
  }

  /**
   * DELETE /produk/{id}
   * (Delete Produk)
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.produkService.remove(id);
  }
}
