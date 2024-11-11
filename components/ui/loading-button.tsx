import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { Loader2 } from "lucide-react";

import { Button, ButtonProps } from "./button";

import { cn } from "@/lib/utils";

export type Props = ButtonProps & {
  loading?: boolean;
};

export const LoadingButton = React.forwardRef<HTMLButtonElement, Props>(
  (
    { className, variant, size, asChild = false, loading, children, ...props },
    ref,
  ) => {
    if (asChild) {
      return (
        <Slot ref={ref} {...props}>
          <>
            {React.Children.map(
              children as React.ReactElement,
              (child: React.ReactElement) => {
                return React.cloneElement(child, {
                  className,
                  children: (
                    <>
                      {loading && (
                        <Loader2
                          className={cn(
                            "h-4 w-4 animate-spin",
                            children && "mr-2",
                          )}
                        />
                      )}
                      {child.props.children}
                    </>
                  ),
                });
              },
            )}
          </>
        </Slot>
      );
    }

    return (
      <Button
        ref={ref}
        className={className}
        variant={variant}
        size={size}
        disabled={loading}
        {...props}
      >
        {loading && (
          <Loader2 className={cn("h-4 w-4 animate-spin", children && "mr-2")} />
        )}
        {children}
      </Button>
    );
  },
);
LoadingButton.displayName = "LoadingButton";
