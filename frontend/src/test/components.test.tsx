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


describe("Button Component Edge Cases", () => {
  it("renders correctly with leftIcon", () => {
    render(
      <Button leftIcon={<span data-testid="icon-left">←</span>}>
        Back
      </Button>
    );
    expect(screen.getByTestId("icon-left")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("renders correctly with rightIcon", () => {
    render(
      <Button rightIcon={<span data-testid="icon-right">→</span>}>
        Next
      </Button>
    );
    expect(screen.getByTestId("icon-right")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("shows loading spinner when isLoading is true", () => {
    const { container } = render(<Button isLoading>Submit</Button>);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("disables button when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("CustomerStatusBadge Variants", () => {
  it("renders with pulse animation when pulse is true", () => {
    const { container } = render(
      <CustomerStatusBadge status="active" pulse />
    );
    const pulseElement = container.querySelector(".animate-ping");
    expect(pulseElement).toBeInTheDocument();
  });

  it("applies custom className when provided", () => {
    const { container } = render(
      <CustomerStatusBadge status="lead" className="custom-class" />
    );
    const badge = container.querySelector(".custom-class");
    expect(badge).toBeInTheDocument();
  });
});
