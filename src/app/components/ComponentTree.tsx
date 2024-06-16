import { useNode } from '@/app/context/NodeContext';
import Node from '@/webgl/Impl/Engine/Node';
import ToggleButton from '@mui/material/ToggleButton';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import Camera from '@/webgl/Impl/Engine/Camera';
import toast from 'react-hot-toast';

export default function ComponentTree({ name }: { name: string }) {
  const { rootNode, selectedNode, setSelectedNode, triggerRender, removeNode } =
    useNode();
  const [renderedTree, setRenderedTree] = useState<JSX.Element | null>(null);

  function handleClick(node: Node) {
    if (selectedNode && selectedNode.id === node.id) {
      setSelectedNode(null);
      return;
    }
    setSelectedNode(node);
  }

  function handleDelete(node: Node) {
    removeNode(node.id);
    toast.success('Node deleted');
  }

  function renderNode(node: Node) {
    const isDeletable =
      !(node instanceof Node && node.constructor.name == 'Node') &&
      !(node instanceof Camera);

    if (node.children.length) {
      return (
        <div key={node.id}>
          <div className="mb-1 flex items-center">
            <ToggleButton
              value="component"
              selected={!!selectedNode && selectedNode.id === node.id}
              onChange={() => handleClick(node)}
              fullWidth
              size="small"
              style={{ justifyContent: 'flex-start' }}
            >
              {node.name}
            </ToggleButton>
            {isDeletable && (
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => handleDelete(node)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </div>
          <div className="border-l-2 pl-4">
            {node.children.map((child) => renderNode(child))}
          </div>
        </div>
      );
    } else {
      return (
        <div key={node.id} className="mb-1 flex items-center">
          <ToggleButton
            value="component"
            selected={!!selectedNode && selectedNode.id === node.id}
            onChange={() => handleClick(node)}
            fullWidth
            size="small"
            style={{ justifyContent: 'flex-start' }}
          >
            {node.name}
          </ToggleButton>
          {isDeletable && (
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => handleDelete(node)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </div>
      );
    }
  }

  useEffect(() => {
    if (rootNode) {
      setRenderedTree(renderNode(rootNode));
    } else {
      setRenderedTree(<p>No root node available</p>);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootNode, selectedNode, triggerRender]);

  return <div className="h-fit overflow-auto w-full p-2">{renderedTree}</div>;
}
