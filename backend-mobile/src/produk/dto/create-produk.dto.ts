// src/produk/dto/create-produk.dto.ts
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateProdukDto {
  @IsString()
  @IsNotEmpty()
  kode_produk: string;

  @IsString()
  @IsNotEmpty()
  nama_produk: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0) // Harga tidak boleh minus
  harga: number;
}
