# Users DTOs

This directory contains Data Transfer Objects (DTOs) for the Users module, organized by context.

## Structure

```
dtos/
├── auth/                    # Authentication-related DTOs
│   ├── login-user.dto.ts    # Login request DTO
│   ├── register-user.dto.ts # Registration request DTO
│   ├── auth-response.dto.ts # Authentication response DTO
│   └── index.ts            # Auth DTOs exports
├── profile/                 # Profile management DTOs
│   ├── update-profile.dto.ts # Profile update request DTO
│   ├── update-password.dto.ts # Password update request DTO
│   └── index.ts            # Profile DTOs exports
└── index.ts                # Main exports file
```

## Usage

### Import all DTOs
```typescript
import { RegisterUserDto, LoginUserDto, AuthResponseDto } from './dtos/auth';
import { UpdateProfileDto, UpdatePasswordDto } from './dtos/profile';
```

### Import specific DTOs
```typescript
import { RegisterUserDto } from './dtos/auth/register-user.dto';
import { UpdateProfileDto } from './dtos/profile/update-profile.dto';
```

## Adding New DTOs

1. Create the DTO file in the appropriate context folder
2. Add the export to the folder's `index.ts`
3. Update the main `index.ts` if needed
4. Update imports in controllers/services

## Context Guidelines

- **auth/**: Authentication, login, registration
- **profile/**: User profile management, updates
- **tracking/**: Sobriety tracking (future)
- **crisis/**: Crisis management (future)
