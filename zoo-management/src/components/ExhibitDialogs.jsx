import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, Save, Trash2 } from "lucide-react";

// Add Exhibit Dialog Component
export function AddExhibitDialog({ isOpen, onOpenChange, onAdd, locations }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    displayTime: "",
    locationId: "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(formData);
    setFormData({
      name: "",
      description: "",
      capacity: "",
      displayTime: "",
      locationId: "",
      imageFile: null,
    });
    setImagePreview(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-teal-600 hover:bg-teal-700 cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add Exhibit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Exhibit</DialogTitle>
          <DialogDescription>
            Add a new exhibit to the WildWood Zoo collection.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="exhibitName">Exhibit Name *</Label>
            <Input
              id="exhibitName"
              placeholder="e.g., Tropical Rainforest"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="exhibitDescription">Description</Label>
            <textarea
              id="exhibitDescription"
              placeholder="Enter exhibit description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full h-24 px-3 py-2 border rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 50"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="displayTime">Display Time</Label>
              <Input
                id="displayTime"
                placeholder="e.g., 9:00 AM - 5:00 PM"
                value={formData.displayTime}
                onChange={(e) =>
                  setFormData({ ...formData, displayTime: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="locationId">Location (Zone)</Label>
            <Select
              value={formData.locationId}
              onValueChange={(value) =>
                setFormData({ ...formData, locationId: value })
              }
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem
                    key={loc.Location_ID}
                    value={loc.Location_ID.toString()}
                  >
                    {loc.Zone} - {loc.Location_Description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="exhibitImage">Exhibit Image</Label>
            <Input
              id="exhibitImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded"
              />
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-700 cursor-pointer"
          >
            Add Exhibit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit Exhibit Dialog Component
export function EditExhibitDialog({
  exhibit,
  isOpen,
  onOpenChange,
  onUpdate,
  onDelete,
  locations,
}) {
  const [formData, setFormData] = useState({
    name: exhibit?.exhibit_Name || "",
    description: exhibit?.exhibit_Description || "",
    capacity: exhibit?.Capacity?.toString() || "",
    displayTime: exhibit?.Display_Time || "",
    locationId: exhibit?.Location_ID?.toString() || "",
    imageFile: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [originalData, setOriginalData] = useState({});

  // Update form when exhibit changes
  useEffect(() => {
    if (exhibit) {
      const data = {
        name: exhibit.exhibit_Name || "",
        description: exhibit.exhibit_Description || "",
        capacity: exhibit.Capacity?.toString() || "",
        displayTime: exhibit.Display_Time || "",
        locationId: exhibit.Location_ID?.toString() || "",
        imageFile: null,
      };
      setFormData(data);
      setOriginalData(data);
      setImagePreview(null);
    }
  }, [exhibit]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  // Check if there are any changes
  const hasChanges = useMemo(() => {
    return (
      formData.name !== originalData.name ||
      formData.description !== originalData.description ||
      formData.capacity !== originalData.capacity ||
      formData.displayTime !== originalData.displayTime ||
      formData.locationId !== originalData.locationId ||
      formData.imageFile !== null
    );
  }, [formData, originalData]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Exhibit</DialogTitle>
          <DialogDescription>
            Update exhibit information for {exhibit?.exhibit_Name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="editExhibitName">Exhibit Name *</Label>
            <Input
              id="editExhibitName"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div>
            <Label htmlFor="editExhibitDescription">Description</Label>
            <textarea
              id="editExhibitDescription"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full h-24 px-3 py-2 border rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="editCapacity">Capacity</Label>
              <Input
                id="editCapacity"
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="editDisplayTime">Display Time</Label>
              <Input
                id="editDisplayTime"
                value={formData.displayTime}
                onChange={(e) =>
                  setFormData({ ...formData, displayTime: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="editLocationId">Location (Zone)</Label>
            <Select
              value={formData.locationId}
              onValueChange={(value) =>
                setFormData({ ...formData, locationId: value })
              }
            >
              <SelectTrigger className="cursor-pointer">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem
                    key={loc.Location_ID}
                    value={loc.Location_ID.toString()}
                  >
                    {loc.Zone} - {loc.Location_Description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {exhibit?.Image_URL && !imagePreview && (
            <div>
              <Label>Current Image</Label>
              <img
                src={exhibit.Image_URL}
                alt={exhibit.exhibit_Name}
                className="mt-2 h-32 w-32 object-cover rounded"
              />
            </div>
          )}
          <div>
            <Label htmlFor="editExhibitImage">
              {exhibit?.Image_URL ? "Change Image" : "Add Image"}
            </Label>
            <Input
              id="editExhibitImage"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 h-32 w-32 object-cover rounded"
              />
            )}
          </div>
          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={!hasChanges}
              className="flex-1 bg-teal-600 hover:bg-teal-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="cursor-pointer"
              onClick={() => onDelete(exhibit)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Exhibit
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
