<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SystemActivityEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    public $item;
    public $channelName;

    public function __construct($title, $type, $icon, $channelName)
    {
        $this->channelName = $channelName;

        $activity = \App\Models\Activity::create([
        'title' => $title,
        'type' => $type,
        'icon' => $icon,
        'channel_name' => $channelName,
    ]);

    // 2. Preparamos el dato para React (formateando la fecha)
    $this->item = [
        'id' => $activity->id,
        'title' => $activity->title,
        'type' => $activity->type,
        'icon' => $activity->icon,
        'time' => $activity->created_at->diffForHumans(),
    ];
    }

    public function broadcastOn(): array
    {
        return [
            new Channel($this->channelName),
        ];
    }
}
