import { Box, Text, Badge } from "@mantine/core";
import type { Card } from "@/app/types";

interface CardImageProps {
  card: Card;
  quantity: number;
}

export function CardImage({ card, quantity }: CardImageProps) {
  return (
    <Box
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "5 / 7", // Standard MTG card ratio
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      {/* Placeholder card image */}
      <Box
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#2c2e33",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "8px",
          border: "1px solid #373a40",
          borderRadius: "8px",
        }}
      >
        <Text
          size="sm"
          fw={600}
          ta="center"
          style={{
            color: "#fff",
            wordBreak: "break-word",
            marginBottom: "8px",
          }}
        >
          {card.name}
        </Text>

        {card.mana_cost && (
          <Text size="xs" c="dimmed" ta="center">
            {card.mana_cost}
          </Text>
        )}

        <Text
          size="xs"
          c="dimmed"
          ta="center"
          style={{ marginTop: "4px" }}
          lineClamp={2}
        >
          {card.type_line}
        </Text>

        {card.power && card.toughness && (
          <Text size="xs" c="dimmed" style={{ marginTop: "auto" }}>
            {card.power}/{card.toughness}
          </Text>
        )}
      </Box>

      {/* Quantity badge */}
      {quantity > 1 && (
        <Badge
          color="blue"
          variant="filled"
          size="lg"
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            fontWeight: 700,
          }}
        >
          {quantity}×
        </Badge>
      )}
    </Box>
  );
}
