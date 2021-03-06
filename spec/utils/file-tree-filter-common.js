/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import invariant from 'assert';

// eslint-disable-next-line nuclide-internal/no-cross-atom-imports
import {FileTreeStore} from '../../pkg/nuclide-file-tree/lib/FileTreeStore';
// eslint-disable-next-line nuclide-internal/no-cross-atom-imports
import {
  EVENT_HANDLER_SELECTOR,
} from '../../pkg/nuclide-file-tree/lib/FileTreeConstants';

import type {TestContext} from './remotable-tests';

export function runTest(context: TestContext) {
  it('sets a filter and then clears it when the sidebar or file tree toggles', () => {
    const store = FileTreeStore.getInstance();
    let elem;
    const workspaceEl = atom.views.getView(atom.workspace);
    waitsFor('DOM to load', 10000, () => {
      elem = document.querySelector(EVENT_HANDLER_SELECTOR);
      return elem != null;
    });

    const close = () => {
      atom.commands.dispatch(workspaceEl, 'nuclide-file-tree:toggle', {visible: true});
    };
    const open = () => {
      atom.commands.dispatch(workspaceEl, 'nuclide-file-tree:toggle', {visible: false});
    };

    runs(() => {
      invariant(elem != null);
      // Open file tree
      open();
      store.clearFilter();

      atom.commands.dispatch(elem, 'nuclide-file-tree:go-to-letter-a');
      expect(store.getFilter()).toEqual('a');

      // Close and open file tree
      close();
      open();
      expect(store.getFilter()).toEqual('');

      atom.commands.dispatch(elem, 'nuclide-file-tree:go-to-letter-a');
      expect(store.getFilter()).toEqual('a');
    });
  });
}
