'use client';

import React from 'react';
import { Select as SelectPrimitive } from 'radix-ui';

type SelectProps = React.ComponentProps<typeof SelectPrimitive.Root>;

const Select = ({ ...props }: SelectProps) => <SelectPrimitive.Root data-slot="select" {...props} />;

export { Select, type SelectProps };
