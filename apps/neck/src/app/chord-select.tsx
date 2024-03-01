import { RootNoteDisplay, RootNoteDisplayList } from '@efl/neck-components';
import { ChordType, ChordTypeList } from './chords';
import {
  Button,
  Key,
  Label,
  ListBox,
  ListBoxItem,
  Popover,
  Select,
  SelectValue,
} from 'react-aria-components';

export type ChordSelectProps = {
  rootNote: RootNoteDisplay;
  chordType: ChordType;
  onSelect: (rootNote: RootNoteDisplay, chordType: ChordType) => void;
};
export const ChordSelect = (props: ChordSelectProps) => {
  const { rootNote, chordType, onSelect } = props;
  return (
    <div style={{ display: 'flex' }}>
      <Select
        selectedKey={RootNoteDisplayList.indexOf(rootNote)}
        onSelectionChange={(key: Key) => {
          onSelect(key as RootNoteDisplay, chordType);
        }}
      >
        <Label>Root</Label>
        <Button>
          <SelectValue>{rootNote}</SelectValue>
        </Button>
        <Popover>
          <ListBox>
            {RootNoteDisplayList.map((note) => (
              <ListBoxItem key={note} id={note}>
                {note}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>
      <Select
        aria-label="chord type"
        selectedKey={chordType}
        onSelectionChange={(key) => {
          onSelect(rootNote, key as ChordType);
        }}
      >
        <Button>
          <SelectValue>{chordType}</SelectValue>
        </Button>
        <Popover>
          <ListBox>
            {ChordTypeList.map((chordType) => (
              <ListBoxItem key={chordType} id={chordType}>
                {chordType}
              </ListBoxItem>
            ))}
          </ListBox>
        </Popover>
      </Select>
    </div>
  );
};
