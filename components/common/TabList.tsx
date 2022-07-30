import Tab, { TabProps } from './Tab';

export default function TabList({ tabs }: { tabs: TabProps[] }) {
  return (
    <div className='border-b border-gray-200 pb-4'>
      <ul className='flex flex-wrap -mb-px items-center text-base font-medium'>
        {tabs.map(({ name, href, as }) => (
          <li key={name}>
            <Tab {...{ name, href, as }} />
          </li>
        ))}
      </ul>
    </div>
  );
}
