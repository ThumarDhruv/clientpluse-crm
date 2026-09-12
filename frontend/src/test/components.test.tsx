import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { CustomerStatusBadge } from "../components/customers/CustomerStatusBadge";
import { Button } from "../components/ui/Button";

describe("Frontend Component Rendering", () => {
  it("renders active customer status badge with correct text", () => {
    render(<CustomerStatusBadge status="active" />);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders lead customer status badge with correct text", () => {
    render(<CustomerStatusBadge status="lead" />);
    expect(screen.getByText("Lead")).toBeInTheDocument();
  });

  it("renders inactive customer status badge with correct text", () => {
    render(<CustomerStatusBadge status="inactive" />);
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  it("renders Button component with children and loading state", () => {
    const { rerender } = render(<Button>Click Me</Button>);
    expect(screen.getByText("Click Me")).toBeInTheDocument();

    rerender(<Button isLoading>Click Me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
