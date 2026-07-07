import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class CustomValidationPipe implements PipeTransform<unknown> {
    async transform(value: unknown, { metatype }: ArgumentMetadata): Promise<unknown> {
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }

        try {
            const object = plainToInstance(metatype, value ?? {}, {
                enableImplicitConversion: true,
            });
            const errors = await validate(object);

            if (errors.length > 0) {
                const messages = this.flattenValidationErrors(errors);

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
            console.error('Validation pipe error:', error);
            throw new BadRequestException({
                message: 'Validation failed',
                errors: [error instanceof Error ? error.message : 'Validation failed'],
            });
        }
    }

    private flattenValidationErrors(errors: ValidationError[]): string[] {
        const messages: string[] = [];

        for (const error of errors) {
            if (error.constraints) {
                messages.push(...Object.values(error.constraints));
                continue;
            }

            if (error.children?.length) {
                messages.push(...this.flattenValidationErrors(error.children));
            }
        }

        return messages.length > 0 ? messages : ['Validation failed'];
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
