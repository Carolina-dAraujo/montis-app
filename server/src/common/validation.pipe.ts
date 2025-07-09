import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<any> {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        try {
            const object = plainToClass(metatype, value);
            const errors = await validate(object);

            if (errors.length > 0) {
                const messages = errors.map(error => {
                    const constraints = error.constraints;
                    if (constraints) {
                        return Object.values(constraints)[0];
                    }
                    return 'Validation failed';
                });

                throw new BadRequestException({
                    message: 'Validation failed',
                    errors: messages,
                });
            }

            return object;
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }
            throw new BadRequestException('Validation failed');
        }
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
