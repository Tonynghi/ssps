import { Meta, StoryObj } from '@storybook/react';

import { Button } from './button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Default',
  },
};

export const Outlined: Story = {
  args: {
    children: 'Outlined',
    variant: 'outlined',
  },
};

export const Text: Story = {
  args: {
    children: 'TEXT',
    variant: 'text',
  },
};

export const DisabledContained: Story = {
  args: {
    children: 'Disabled Contained',
    variant: 'contained',
    disabled: true,
  },
};

export const DisabledOutlined: Story = {
  args: {
    children: 'Disabled Outlined',
    variant: 'outlined',
    disabled: true,
  },
};

export const DisabledText: Story = {
  args: {
    children: 'Disabled Text',
    variant: 'text',
    disabled: true,
  },
};

export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'contained',
    theme: 'success',
  },
};

export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'contained',
    theme: 'warning',
  },
};

export const Danger: Story = {
  args: {
    children: 'Danger',
    variant: 'contained',
    theme: 'danger',
  },
};

export const PillShape: Story = {
  args: {
    children: 'Pill Shape',
    shape: 'pill',
  },
};

export const FullWidth: Story = {
  args: {
    children: 'Full Width',
    width: 'full',
  },
  parameters: {
    layout: 'padded',
  },
};

export const BigSize: Story = {
  args: {
    children: 'Big Size',
    size: 'large',
  },
};

export const SmallSize: Story = {
  args: {
    children: 'Small Size',
    size: 'small',
  },
};

export const LeadingIcon: Story = {
  args: {
    children: 'Icon',
    leadingIcon: {
      filename: 'icons/fessior_white.svg',
      alt: 'logo',
    },
  },
};

export const TrailingIcon: Story = {
  args: {
    children: 'Icon',
    trailingIcon: {
      filename: 'icons/fessior_white.svg',
      alt: 'logo',
    },
  },
};

export const OnlyIcon: Story = {
  args: {
    leadingIcon: {
      filename: '/icons/auth/close_royal.svg',
      alt: 'logo',
    },
    variant: 'outlined',
    theme: 'primary',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading',
    isLoading: true,
  },
};
