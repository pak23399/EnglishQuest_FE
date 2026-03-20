import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '../button';
import { Input, InputProps } from '../input';

export function PasswordInput({ children, ...props }: InputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative">
      <Input type={passwordVisible ? 'text' : 'password'} {...props} />
      <Button
        type="button"
        variant="ghost"
        mode="icon"
        onClick={() => setPasswordVisible(!passwordVisible)}
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      >
        {passwordVisible ? (
          <EyeOff className="text-muted-foreground" />
        ) : (
          <Eye className="text-muted-foreground" />
        )}
      </Button>
    </div>
  );
}
