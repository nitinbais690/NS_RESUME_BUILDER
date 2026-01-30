interface SidebarListSectionProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
}

export const SidebarListSection = <T,>({
  title,
  items,
  renderItem,
}: SidebarListSectionProps<T>) => {
  if (!items || items.length === 0) return null;
  return (
    <div className="template-sidebar-section">
      <h3 className="template-section-title">{title}</h3>
      {items.map((item, i) => renderItem(item, i))}
    </div>
  );
};
