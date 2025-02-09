import { fireEvent, render, screen } from '@testing-library/react';
import { ConsoleObject } from '@common/ConsoleObject';
import { CONSOLE_METHODS } from '@constants/console';

describe('ConsoleObject', () => {
  it('renders simple object expanded by default', () => {
    const testObj = { name: 'test', value: 123 };
    render(<ConsoleObject value={testObj} type={CONSOLE_METHODS.LOG} />);

    expect(screen.getByText(/▼ Object/)).toBeInTheDocument();
    expect(screen.getByTestId('expandable')).toBeInTheDocument();
    
    // First level should be visible by default
    expect(screen.getByText(/name/)).toBeInTheDocument();
    expect(screen.getByText(/"test"/)).toBeInTheDocument();
    expect(screen.getByText(/value/)).toBeInTheDocument();
    expect(screen.getByText(/123/)).toBeInTheDocument();
  });

  it('renders nested objects with first level expanded', () => {
    const nestedObj = {
      user: {
        details: {
          name: 'test',
          age: 25
        }
      }
    };
    render(<ConsoleObject value={nestedObj} type={CONSOLE_METHODS.LOG} />);

    // First level should be visible
    expect(screen.getByText(/"user":/)).toBeInTheDocument();
    expect(screen.getByText(/▼ Object/)).toBeInTheDocument();
    
    // Second level should be hidden
    expect(screen.queryByText(/"details":/)).not.toBeInTheDocument();
    
    // Expand second level
    const nestedButton = screen.getByText(/▶ Object/);
    fireEvent.click(nestedButton);
    expect(screen.getAllByText(/▼ Object/)).toHaveLength(2);
    expect(screen.getByText(/"details":/)).toBeInTheDocument();
  });

  it('renders arrays with proper formatting', () => {
    const testArray = ['one', 2, { test: true }];
    render(<ConsoleObject value={testArray} type={CONSOLE_METHODS.LOG} label={`Array(${testArray.length})`} />);

    // First level should be visible
    expect(screen.getByText(/▼ Array/)).toBeInTheDocument();
    expect(screen.getByText(/"one"/)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    const expandableButtons = screen.getAllByTestId('expandable');
    expect(expandableButtons).toHaveLength(2);

    // Expand second level
    fireEvent.click(expandableButtons[1]);
    expect(screen.getByText('"test":')).toBeInTheDocument();
    expect(screen.getByText('true')).toBeInTheDocument();
  });

  it('handles complex circular references at different depths', () => {
    const circular = { 
      name: 'level1', 
      obj2: { 
        name: 'level2',
        obj3: {
          name: 'level3',
          obj4: {
            name: 'level4'
          }
        }
      }
    };

    // Make circular references at different depths
    // @ts-ignore
    circular.obj2.obj3.obj4.self = circular.obj2.obj3.obj4;  // level4 points to itself
    // @ts-ignore
    circular.obj2.obj3.parent = circular.obj2;               // level3 points to level2
    // @ts-ignore
    circular.obj2.root = circular;                           // level2 points to root
    // @ts-ignore
    circular.self = circular;                                // root points to itself
    
    render(<ConsoleObject value={circular} type={CONSOLE_METHODS.LOG} />);

    // Default should expand root level
    const expandableButtons = screen.getAllByTestId('expandable');
    expect(expandableButtons).toHaveLength(2);

    expect(screen.getByText('"name":')).toBeInTheDocument();
    expect(screen.getByText('"level1"')).toBeInTheDocument();
    expect(screen.getByText('"self":')).toBeInTheDocument();
    expect(screen.getByText(/\[Circular → /)).toBeInTheDocument();

    // Expand obj2
    const obj2Button = screen.getByText(/▶ Object/);
    fireEvent.click(obj2Button);
    expect(screen.getByText('"level2"')).toBeInTheDocument();
    expect(screen.getByText('"root":')).toBeInTheDocument();
    expect(screen.getAllByText(/\[Circular → /)).toHaveLength(2); // self and root references

    // Expand obj3
    const obj3Button = screen.getByText(/▶ Object/);
    fireEvent.click(obj3Button);
    expect(screen.getByText('"level3"')).toBeInTheDocument();
    expect(screen.getByText('"parent":')).toBeInTheDocument();
    expect(screen.getAllByText(/\[Circular → /)).toHaveLength(3); // includes parent reference

    // Expand obj4
    const obj4Button = screen.getByText(/▶ Object/);
    fireEvent.click(obj4Button);
    expect(screen.getByText('"level4"')).toBeInTheDocument();
    expect(screen.getAllByText(/\[Circular → /)).toHaveLength(4); // includes obj4 self reference
  });
}); 