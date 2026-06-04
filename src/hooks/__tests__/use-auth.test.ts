import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";

// Mocks ANTES de qualquer import
vi.mock("next/navigation");
vi.mock("server-only", () => ({}));
vi.mock("@/lib/auth");
vi.mock("@/lib/prisma");
vi.mock("@/lib/anon-work-tracker");

// Mock de @/actions que evita chamar funções reais
vi.mock("@/actions", () => ({
  signIn: vi.fn(),
  signUp: vi.fn(),
  getProjects: vi.fn(),
  createProject: vi.fn(),
}));

import { useRouter } from "next/navigation";
import { useAuth } from "../use-auth";
import * as actions from "@/actions";
import * as anonTracker from "@/lib/anon-work-tracker";

describe("useAuth Hook", () => {
  const mockRouter = { push: vi.fn() };
  const mockProject = {
    id: "proj-1",
    name: "Projeto Teste",
    messages: [],
    data: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
  });

  describe("signIn com sucesso", () => {
    it("redireciona para projeto existente", async () => {
      (actions.signIn as any).mockResolvedValue({ success: true });
      (anonTracker.getAnonWorkData as any).mockReturnValue(null);
      (actions.getProjects as any).mockResolvedValue([mockProject]);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("user@test.com", "senha");
      });

      expect(mockRouter.push).toHaveBeenCalledWith("/proj-1");
    });

    it("cria novo projeto se nenhum existe", async () => {
      (actions.signIn as any).mockResolvedValue({ success: true });
      (anonTracker.getAnonWorkData as any).mockReturnValue(null);
      (actions.getProjects as any).mockResolvedValue([]);
      (actions.createProject as any).mockResolvedValue(mockProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("user@test.com", "senha");
      });

      expect(actions.createProject).toHaveBeenCalled();
      expect(mockRouter.push).toHaveBeenCalledWith("/proj-1");
    });

    it("preserva trabalho anônimo", async () => {
      const anonWork = {
        messages: [{ role: "user", content: "Criar card" }],
        fileSystemData: { "/Card.jsx": "" },
      };

      (actions.signIn as any).mockResolvedValue({ success: true });
      (anonTracker.getAnonWorkData as any).mockReturnValue(anonWork);
      (actions.createProject as any).mockResolvedValue(mockProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signIn("user@test.com", "senha");
      });

      expect(actions.createProject).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: anonWork.messages,
          data: anonWork.fileSystemData,
        })
      );
      expect(anonTracker.clearAnonWork).toHaveBeenCalled();
    });
  });

  describe("signIn com falha", () => {
    it("não redireciona se credenciais inválidas", async () => {
      (actions.signIn as any).mockResolvedValue({
        success: false,
        error: "Credenciais inválidas",
      });

      const { result } = renderHook(() => useAuth());

      const response = await act(async () => {
        return await result.current.signIn("user@test.com", "wrongpass");
      });

      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(response).toEqual({ success: false, error: "Credenciais inválidas" });
    });
  });

  describe("signUp", () => {
    it("registra novo usuário com sucesso", async () => {
      (actions.signUp as any).mockResolvedValue({ success: true });
      (anonTracker.getAnonWorkData as any).mockReturnValue(null);
      (actions.getProjects as any).mockResolvedValue([]);
      (actions.createProject as any).mockResolvedValue(mockProject);

      const { result } = renderHook(() => useAuth());

      await act(async () => {
        await result.current.signUp("novo@test.com", "senha");
      });

      expect(mockRouter.push).toHaveBeenCalledWith("/proj-1");
    });

    it("não registra se email existe", async () => {
      (actions.signUp as any).mockResolvedValue({
        success: false,
        error: "Email já existe",
      });

      const { result } = renderHook(() => useAuth());

      const response = await act(async () => {
        return await result.current.signUp("existente@test.com", "senha");
      });

      expect(mockRouter.push).not.toHaveBeenCalled();
      expect(response.success).toBe(false);
    });
  });

  describe("Estado de loading", () => {
    it("inicia false e volta false após async", async () => {
      (actions.signIn as any).mockResolvedValue({ success: true });
      (anonTracker.getAnonWorkData as any).mockReturnValue(null);
      (actions.getProjects as any).mockResolvedValue([mockProject]);

      const { result } = renderHook(() => useAuth());

      expect(result.current.isLoading).toBe(false);

      await act(async () => {
        await result.current.signIn("user@test.com", "senha");
      });

      expect(result.current.isLoading).toBe(false);
    });
  });
});
