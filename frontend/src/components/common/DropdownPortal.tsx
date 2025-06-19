import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';

interface DropdownPortalProps {
  isOpen: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const DropdownPortal: React.FC<DropdownPortalProps> = ({
  isOpen,
  triggerRef,
  onClose,
  children,
  className = '',
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'bottom' as 'top' | 'bottom' });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen || !triggerRef.current || !dropdownRef.current) return;

    const updatePosition = () => {
      if (!triggerRef.current || !dropdownRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Calculate preferred position (below the trigger) - using viewport coordinates
      let top = triggerRect.bottom + 8;
      let left = triggerRect.right - dropdownRect.width;
      let placement: 'top' | 'bottom' = 'bottom';

      // Check if dropdown would go outside viewport bottom
      if (triggerRect.bottom + dropdownRect.height + 8 > viewportHeight) {
        // Position above the trigger instead
        top = triggerRect.top - dropdownRect.height - 8;
        placement = 'top';
      }

      // Ensure dropdown doesn't go outside viewport horizontally
      if (left < 8) {
        left = 8;
      } else if (left + dropdownRect.width > viewportWidth - 8) {
        left = viewportWidth - dropdownRect.width - 8;
      }

      setPosition({ top, left, placement });
    };

    // Initial position calculation
    updatePosition();

    // Update position on scroll/resize
    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen, triggerRef]);

  // Handle clicks outside dropdown
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen) return null;

  const portalContent = (
    <div
      ref={dropdownRef}
      className={`fixed z-[9999] bg-white rounded-lg shadow-xl border border-gray-100 ${className}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        minWidth: '120px',
      }}
    >
      {children}
    </div>
  );

  return createPortal(portalContent, document.body);
};

export default DropdownPortal; 