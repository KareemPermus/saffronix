import { FiSearch } from 'react-icons/fi';
import styles from '@/styles/SearchBar.module.css';

interface Props {
  value: string;
  onChange: (v: string) => void;
  count: number;
}

export default function SearchBar({ value, onChange, count }: Props) {
  return (
    <div className={styles.wrap}>
      <FiSearch className={styles.icon} />
      <input
        className={styles.input}
        placeholder={`Search ${count > 0 ? count.toLocaleString() : ''} recipes…`}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}