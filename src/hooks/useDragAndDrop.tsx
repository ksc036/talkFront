import { useCallback, useState, useEffect, ChangeEvent } from 'react';

const useDragAndDrop = (
  dragRef: React.RefObject<HTMLElement>,
  onChangeFiles: (e: any) => void,
) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent): void => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer?.files) {
      setIsDragging(true);
    }
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();

      onChangeFiles(e);
      setIsDragging(false);
    },
    [onChangeFiles],
  );

  // 마운트시 ref 객체에 이벤트리스너 등록
  const initDragEvents = useCallback((): void => {
    if (!dragRef.current) return;
    dragRef.current.addEventListener('dragenter', handleDragEnter);
    dragRef.current.addEventListener('dragleave', handleDragLeave);
    dragRef.current.addEventListener('dragover', handleDragOver);
    dragRef.current.addEventListener('drop', handleDrop);
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  // 언마운트시 ref 객체에 등록된 이벤트리스너 삭제
  const resetDragEvents = useCallback((): void => {
    if (!dragRef.current) return;
    dragRef.current.removeEventListener('dragenter', handleDragEnter);
    dragRef.current.removeEventListener('dragleave', handleDragLeave);
    dragRef.current.removeEventListener('dragover', handleDragOver);
    dragRef.current.removeEventListener('drop', handleDrop);
  }, [handleDragEnter, handleDragLeave, handleDragOver, handleDrop]);

  useEffect(() => {
    initDragEvents();
    return () => resetDragEvents();
  }, [initDragEvents, resetDragEvents]);

  return { isDragging };
};

export default useDragAndDrop;
