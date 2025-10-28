import { Menu, Transition } from '@headlessui/react';
import { JSX, ReactNode, Ref } from 'react';

export default function Dropdown({
  children,
  classButton,
  menuItems,
  classMenuItems,
  openDirection,
  buttonInputRef,
}: {
  children: ReactNode;
  classButton?: string;
  menuItems?: ReactNode[];
  classMenuItems: string;
  openDirection: 'left' | 'right';
  buttonInputRef: Ref<HTMLButtonElement>;
}): JSX.Element {
  return (
    <Menu>
      <div className="relative flex items-center">
        <Menu.Button className={`outline-hidden cursor-pointer ${classButton}`} ref={buttonInputRef}>
          {children}
        </Menu.Button>

        <Transition
          className={`absolute ${openDirection === 'left' ? 'left-0' : 'right-0'}`}
          enter="transform transition duration-50 ease-out"
          enterFrom="scale-98 opacity-0"
          enterTo="scale-100 opacity-100"
          leave="transform transition duration-50 ease-out"
          leaveFrom="scale-98 opacity-100"
          leaveTo="scale-100 opacity-0"
        >
          <Menu.Items className={`absolute ${classMenuItems}`}>
            {menuItems && (
              <div className="w-full max-w-xs">
                {menuItems?.map((item, index) => (
                  <Menu.Item key={'menuitem-' + index}>{item}</Menu.Item>
                ))}
              </div>
            )}
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
}
