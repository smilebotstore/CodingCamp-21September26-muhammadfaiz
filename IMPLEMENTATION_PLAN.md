# Expense & Budget Visualizer - Implementation Plan

## Problem Statement
A mobile-friendly web application for tracking daily expenses with budget visualization. Features include transaction management, automatic balance updates, pie chart visualizations, monthly summaries, dark/light mode toggle, and custom category support.

## Requirements
- **Input Form**: Item Name, Amount, Category (Food, Transport, Fun with custom categories)
- **Transaction List**: Scrollable list with delete functionality
- **Total Balance**: Automatic updates on add/delete
- **Visual Chart**: Pie chart showing spending by category
- **Monthly Summary**: Total spent, budget remaining, transaction count, category breakdown
- **Dark/Light Mode**: Theme toggle with preference persistence
- **Custom Categories**: Add new categories beyond defaults

## Technical Constraints
- **TC-1**: HTML/CSS/Vanilla JS only (no frameworks)
- **TC-2**: Browser Local Storage for data persistence
- **TC-3**: Modern browser compatibility (Chrome, Firefox, Edge, Safari)
- **Folder Structure**: css/ (1 file), js/ (1 file)

## Folder Structure
```
CodingCamp-21September26-muhammadfaiz/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── IMPLEMENTATION_PLAN.md
```

## Implementation Tasks

### Phase 1: Project Setup & Core Structure
**Task 1: Create project folder structure**
- Create css/ and js/ subdirectories
- Create index.html at root level
- Establish clean, organized structure

**Task 2: Create index.html with semantic structure**
- Build main HTML with semantic elements:
  - Header for balance display + theme toggle
  - Main section for transaction input form
  - Transactions section for scrollable list
  - Monthly summary section
  - Footer for chart
- Include form elements: item name input, amount input, category dropdown
- Add chart container div for Chart.js
- Include theme toggle button

**Task 3: Create base CSS with responsive design**
- Mobile-first responsive design
- Clean typography and visual hierarchy
- CSS variables for theming (--primary-color, --bg-color, --text-color, etc.)
- Dark/light mode theme variables
- Accessible color contrast

### Phase 2: Data Management & Core Logic
**Task 4: Implement core data structures and storage utilities**
- Define transaction interface: { id, name, amount, category, date }
- Define monthly budget object structure
- Implement local storage functions (saveData, loadData)
- Add data validation and error handling

**Task 5: Build transaction input form with validation**
- Real-time form validation (all fields required)
- Currency format for amount input
- Category dropdown with default categories + custom
- Success/error feedback UI
- Form reset after successful submission

**Task 6: Create transaction list rendering**
- Scrollable container with proper overflow handling
- Display item name, formatted amount, category
- Delete button with visual feedback
- Empty state message when no transactions

**Task 7: Implement total balance calculation**
- Calculate total spent from all transactions
- Display balance prominently at top
- Automatic update on add/delete operations
- Currency formatting and localization

**Task 8: Add delete functionality for transactions**
- Delete button on each transaction
- Remove from data array and update storage
- Smooth removal animation
- Re-render list after deletion

### Phase 3: Advanced Features & Visualization
**Task 9: Build monthly summary component**
- Total spent this month
- Budget remaining calculation
- Number of transactions counter
- Expandable daily breakdown view
- Category-wise spending summary

**Task 10: Implement dark/light mode toggle**
- Toggle button with icon
- CSS variable switching
- Persist preference in local storage
- Smooth theme transitions

**Task 11: Build pie chart visualization**
- Integrate Chart.js via CDN
- Pie chart for spending by category
- Auto-update on data changes
- Color coding per category
- Legend with category names

**Task 12: Implement budget visualization**
- Global monthly budget input
- Per-category budget support
- Visual progress indicators (bars/gauges)
- Alert when exceeding budget
- Budget adjustment UI

**Task 13: Add custom category management**
- Add new category input field
- Duplicate prevention (case-insensitive)
- Dynamic dropdown updates
- Default categories cannot be deleted
- Category limit (optional max 10)

### Phase 4: Polish & Finalization
**Task 14: Implement responsive design optimization**
- Mobile touch target sizing (min 44px)
- Flexible grid layout
- Readable text on small screens
- Optimize chart display for mobile

**Task 15: Add final polish and accessibility**
- ARIA labels for screen readers
- Keyboard navigation support
- Proper semantic HTML structure
- Color contrast validation (WCAG AA minimum)
- Focus indicators for interactive elements

**Task 16: Test and verify all functionality**
- Test transaction CRUD operations
- Verify balance calculations
- Check chart updates
- Test budget tracking
- Validate theme switching
- Cross-browser compatibility testing

## Design Overview

```
┌─────────────────────────────────────────┐
│  Header: Total Balance + Theme Toggle   │
├─────────────────────────────────────────┤
│  Monthly Summary Cards                  │
│  [Total Spent] [Budget] [Transactions]  │
├───────────────────────��─────────────────┤
│  Transaction Input Form                 │
│  [Name] [Amount] [Category] [Add]      │
├─────────────────────────────────────────┤
│  Transaction List (Scrollable)          │
│  • Transaction 1 ... [Delete]           │
│  • Transaction 2 ... [Delete]           │
│  • Transaction 3 ... [Delete]           │
├─────────────────────────────────────────┤
│  Spending Chart (Pie)                   │
│  ┌───────────────────────────────┐      │
│  │         [Pie Chart]           │      │
│  └───────────────────────────────┘      │
└─────────────────────────────────────────┘
```

## Data Flow

```
User Input → Validation → Update State → 
Local Storage → Re-render UI → Update Chart → 
Update Summary → Update Balance
```

## Dependencies
- **Chart.js** (CDN): Pie chart visualization
- **Vanilla JS**: Core application logic
- **CSS Variables**: Theme management

## Success Criteria
- All features work without server/backend
- Data persists across browser sessions
- Responsive on mobile devices (320px - 1920px)
- Theme switching works smoothly
- Chart updates instantly with data changes
- Accessibility compliant (WCAG AA minimum)

## Next Steps
1. Review and approve this plan
2. Create project folder structure
3. Begin implementation following task order
4. Test each feature as developed
5. Final polish and verification
