import { ApplicationError } from '@/protocols';

export function genericError(name: string, message: string): ApplicationError {
  return {
    name,
    message
  };
}