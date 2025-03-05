import * as React from "react"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                entry:
                    "border-transparent bg-[rgba(76,175,80,0.15)] text-[#2E7D32]",        // Entry theme
                exit:
                    "border-transparent bg-[rgba(211,47,47,0.15)] text-[#C62828]",         // Exit theme
                fallback:
                    "border-transparent bg-[rgba(158,158,158,0.15)] text-[#616161]",   // Fallback theme
                unauthorized:
                    "border-transparent bg-[rgba(251,192,45,0.15)] text-[#F57F17]",// Unauthorized theme
                default:
                    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
                destructive:
                    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {
}

function Badge({className, variant, ...props}: BadgeProps) {
    return (
        <div className={cn(badgeVariants({variant}), className)} {...props} />
    )
}

export {Badge, badgeVariants}
