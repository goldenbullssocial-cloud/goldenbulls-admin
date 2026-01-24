"use client";

import React, { useEffect, useState } from "react";
import { Trash2, Edit, X } from "lucide-react";
import { toast } from "sonner";
import styles from "./CryptoChainModal.module.scss";
import {
  createCryptoChain,
  updateCryptoChain,
  deleteCryptoChain,
  getAllCryptoChains,
} from "@/api/cryptoChain";

export const CryptoChainModal = () => {
  const [chain, setChain] = useState("");
  const [loading, setLoading] = useState(false);
  const [chains, setChains] = useState([]);
  const [editingChain, setEditingChain] = useState(null);

  // Load chains when modal opens
  const fetchChains = async () => {
    try {
      const response = await getAllCryptoChains();
      setChains(response?.payload?.data || []);
    } catch (error) {
      toast.error("Failed to load chains");
    }
  };

  useEffect(() => {
    fetchChains();
  }, []);

  const handleSubmit = async () => {
    if (!chain.trim()) return;

    try {
      setLoading(true);

      if (editingChain) {
        await updateCryptoChain(editingChain._id, chain.trim());
        toast.success("Chain updated successfully");
      } else {
        await createCryptoChain(chain.trim());
        toast.success("Chain added successfully");
      }

      await fetchChains();
      setChain("");
      setEditingChain(null);
    } catch (error) {
      console.error("Error saving chain:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to save chain",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteCryptoChain(id);
      await fetchChains();
      toast.success("Chain deleted successfully");
    } catch (error) {
      console.error("Error deleting chain:", error);
      toast.error("Failed to delete chain");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (chain) => {
    setEditingChain(chain);
    setChain(chain.chain);
  };

  const handleCancelEdit = () => {
    setEditingChain(null);
    setChain("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.formGroup}>
        <label className={styles.label}>
          {editingChain ? "Edit Chain" : "Network Chain"}
        </label>
        <div className={styles.inputGroup}>
          <input
            placeholder="Enter chain name"
            value={chain}
            onChange={(e) => setChain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          {editingChain && (
            <button onClick={handleCancelEdit} className={styles.cancelButton}>
              <X />
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={loading || !chain.trim()}
            style={{ height: "55px" }}
          >
            <span>
              {loading ? "Saving..." : editingChain ? "Update" : "Add chain"}
            </span>
          </button>
        </div>
      </div>

      <div className={styles.divider}>
        <h3 className={styles.title}>Available Chains</h3>
        {chains.length === 0 ? (
          <p className={styles.emptyState}>No chains available</p>
        ) : (
          <div className={styles.chainsList}>
            {chains.map((item) => (
              <div key={item._id} className={styles.chainItem}>
                <span>{item.chain}</span>
                <div className={styles.actions}>
                  <button onClick={() => handleEdit(item)} disabled={loading}>
                    <span>
                      <Edit />
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={loading}
                    className={styles.deleteButton}
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
