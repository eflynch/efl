import {
  Button,
  Key,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select as AriaSelect,
  SelectValue,
} from 'react-aria-components';
import { ReactNode } from 'react';

export type SelectProps<T> = {
  label:string
  value:T
  values:T[]
  onSelect: (value:T) => void;
};

export function Select<T>(props: SelectProps<T>):ReactNode {
  const { value, values, onSelect, label } = props;
  return (
    <AriaSelect
        selectedKey={value as Key}
        onSelectionChange={(key: Key) => {
            onSelect(key as T);
        }}
    >
    <Label>{label}</Label>
    <Button>
        <SelectValue>{value as ReactNode}</SelectValue>
    </Button>
    <Popover>
        <ListBox>
        {values.map((value) => (
            <ListBoxItem key={value as Key} id={value as Key}>
                {value as ReactNode}
            </ListBoxItem>
        ))}
        </ListBox>
    </Popover>
    </AriaSelect>
  );
}