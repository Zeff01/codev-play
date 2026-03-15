"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Types

interface Props {
    /**
     * true  = this player received the offer (show Accept / Decline)
     * false = this player sent the offer (show Cancel)
     */
    isRecipient?: boolean;
    onAccept: () => void;
    onDecline: () => void;
}

// Component

/**
 * DrawOfferModal
 *
 * Uses shadcn's AlertDialog
 * theme tokens, focus trap, and Escape-to-close for free.
 */
export default function DrawOfferModal({
    isRecipient = true,
    onAccept,
    onDecline,
}: Props) {
    return (
        <AlertDialog open>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-outfit">
                        {isRecipient ? "Draw Offered" : "Draw Offer Sent"}
                    </AlertDialogTitle>
                    <AlertDialogDescription className="font-roboto">
                        {isRecipient
                            ? "Your opponent has offered a draw. Do you want to accept?"
                            : "Waiting for your opponent to respond to your draw offer."}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    {isRecipient ? (
                        <>
                            <AlertDialogCancel
                                onClick={onDecline}
                                className="font-roboto"
                            >
                                Decline
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={onAccept}
                                className="font-roboto"
                            >
                                Accept Draw
                            </AlertDialogAction>
                        </>
                    ) : (
                        <AlertDialogCancel
                            onClick={onDecline}
                            className="font-roboto"
                        >
                            Cancel Offer
                        </AlertDialogCancel>
                    )}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}