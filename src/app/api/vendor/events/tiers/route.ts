import { NextResponse } from 'next/server';
import { store } from '@/lib/store';
import { TicketTier } from '@/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, eventId } = body;

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required' }, { status: 400 });
    }

    if (action === 'update_tier') {
      const { tierId, updates } = body;
      if (!tierId || !updates) {
        return NextResponse.json({ error: 'tierId and updates are required' }, { status: 400 });
      }

      if (updates.price !== undefined) updates.price = Number(updates.price);
      if (updates.totalCapacity !== undefined) updates.totalCapacity = Number(updates.totalCapacity);

      const success = store.updateTicketTier(eventId, tierId, updates);
      if (!success) {
        return NextResponse.json({ error: 'Event or Tier not found' }, { status: 404 });
      }

      const event = store.getEventById(eventId);
      return NextResponse.json({
        success: true,
        message: 'Ticket tier and capacity updated successfully!',
        event,
      });
    }

    if (action === 'add_tier') {
      const { tierName, price, totalCapacity, perks = [] } = body;
      if (!tierName || price === undefined || !totalCapacity) {
        return NextResponse.json(
          { error: 'Tier name, price, and total capacity are required' },
          { status: 400 }
        );
      }

      const newTier: TicketTier = {
        id: `tier-added-${Date.now()}`,
        eventId,
        tierName: tierName.trim(),
        price: Number(price),
        totalCapacity: Number(totalCapacity),
        soldCount: 0,
        perks: Array.isArray(perks) ? perks : [perks],
      };

      const success = store.addTicketTier(eventId, newTier);
      if (!success) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }

      const event = store.getEventById(eventId);
      return NextResponse.json({
        success: true,
        message: `Ticket tier "${newTier.tierName}" created with ${newTier.totalCapacity} capacity!`,
        event,
        tier: newTier,
      });
    }

    if (action === 'delete_tier') {
      const { tierId } = body;
      if (!tierId) {
        return NextResponse.json({ error: 'tierId is required' }, { status: 400 });
      }

      const success = store.deleteTicketTier(eventId, tierId);
      if (!success) {
        return NextResponse.json(
          { error: 'Cannot delete tier (at least one tier must remain, or tier not found).' },
          { status: 400 }
        );
      }

      const event = store.getEventById(eventId);
      return NextResponse.json({
        success: true,
        message: 'Ticket tier deleted.',
        event,
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
