import "reflect-metadata";
import {
  Param,
  Body,
  Post,
  Put,
  Delete,
  JsonController,
} from "routing-controllers";

import { prisma as prismaClient } from "..";
import { Prisma } from "@prisma/client";
import { ReasonPhrases } from "http-status-codes";

@JsonController("/products")
export class ProductController {
  @Post("/")
  async post(@Body() product: Prisma.ProductCreateInput) {
    const createdProduct = await prismaClient.product.create({ data: product });

    return createdProduct;
  }

  @Put("/:id")
  async put(
    @Param("id") id: string,
    @Body() product: Prisma.ProductUpdateInput
  ) {
    try {
      const updatedProduct = await prismaClient.product.update({
        where: {
          id,
        },
        data: product,
      });

      return updatedProduct;
    } catch (error: any) {
      console.log("🚀 ~ ProductController ~ error:", error);
      return { error: ReasonPhrases.BAD_REQUEST, message: error.meta.cause };
    }
  }

  @Delete("/:id")
  async remove(@Param("id") id: string) {
    try {
      const deletedProduct = await prismaClient.product.delete({
        where: {
          id,
        },
      });

      if (deletedProduct) return ReasonPhrases.OK;
    } catch (error: any) {
      return { error: ReasonPhrases.NOT_FOUND, message: error.meta.cause };
    }
  }
}
