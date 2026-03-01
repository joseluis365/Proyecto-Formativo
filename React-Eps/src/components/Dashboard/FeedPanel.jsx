import FeedItem from "./FeedItem";
import { useState, useEffect } from 'react';
import echo from "../../lib/echo";

export default function FeedPanel({ feedItems = [], channelName }) {
const [items, setItems] = useState(feedItems);

  useEffect(() => {
    setItems(feedItems);
  }, [feedItems]);

  useEffect(() => {
    // Usamos la instancia importada directamente
    const channel = echo.channel(channelName)
      .listen('SystemActivityEvent', (e) => {
        // Importante: Laravel envía el objeto dentro de 'item' 
        // (o como lo hayas definido en el evento)
        setItems((prev) => [e.item, ...prev].slice(0, 5));
      });

    return () => echo.leave(channelName);
  }, [channelName]);

  return (
    <div className="lg:col-span-1 bg-white dark:bg-gray-900/50 rounded-xl border border-neutral-gray-border/20 dark:border-gray-800 shadow-sm p-6">
      <h3 className="text-gray-800 dark:text-gray-200 text-lg font-semibold mb-4">
        Actividad Reciente
      </h3>

      <div className="space-y-6">
        {items.map((item) => (
          <FeedItem key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}
